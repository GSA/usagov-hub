<?php

class CDSQueue extends SystemQueue {

  public function numberOfItems() {
    return db_query('SELECT COUNT(item_id) FROM {cds_queue} WHERE name = :name', array(':name' => $this->name))->fetchField();
  }

  public function createItem($data) {
    if ( empty($data['uuid']) )
    {
        return false;
    }
    $query = db_merge('cds_queue')
        ->key(array('name'=>$this->name, 'data_uuid' => $data['uuid']))
        ->fields(array(
            'data_uuid' => $data['uuid'],
            'name'      => $this->name,
            'data'      => serialize($data),
            'created'   => time(),
        ));
    return (bool) $query->execute();
  }

  public function claimItem($lease_time = 30) {
    // Claim an item by updating its expire fields. If claim is not successful
    // another thread may have claimed the item in the meantime. Therefore loop
    // until an item is successfully claimed or we are reasonably sure there
    // are no unclaimed items left.
    while (TRUE) {
      $query = "
        SELECT data, data_uuid
        FROM {cds_queue} q
        WHERE ( expire = 0 OR expire < :tstamp )
              AND name = :name
        ORDER BY created, item_id ASC
      ";
      $item = db_query_range($query, 0, 1, array(
          ':name' => $this->name,
          ':tstamp'=>time()
      ))->fetchObject();
      if ($item) {
        // Try to update the item. Only one thread can succeed in UPDATEing the
        // same row. We cannot rely on REQUEST_TIME because items might be
        // claimed by a single consumer which runs longer than 1 second. If we
        // continue to use REQUEST_TIME instead of the current time(), we steal
        // time from the lease, and will tend to reset items before the lease
        // should really expire.
        $update = db_update('cds_queue')
          ->fields(array(
            'expire' => min(3600,max(1,intval($lease_time)))
          ))
          ->condition('data_uuid', $item->data_uuid);
        // If there are affected rows, this update succeeded.
        if ($update->execute()) {
          $item->data = unserialize($item->data);
          return $item;
        }
      }
      else {
        // No items currently available to claim.
        return FALSE;
      }
    }
  }

  public function releaseItem($item) {
    $update = db_update('cds_queue')
      ->fields(array(
        'expire' => 0,
      ))
      ->condition('data_uuid', $item->data_uuid);
      return $update->execute();
  }

  public function deleteItem($item) {
    db_delete('cds_queue')
      ->condition('data_uuid', $item->data_uuid)
      ->execute();
  }

  public function deleteQueue() {
    db_delete('cds_queue')
      ->condition('name', $this->name)
      ->execute();
  }
}
