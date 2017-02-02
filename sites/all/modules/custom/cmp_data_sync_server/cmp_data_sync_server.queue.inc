<?php

class CDSQueue extends SystemQueue
{
    public function numberOfItems()
    {
        return db_query('SELECT COUNT(item_id) FROM {cds_queue} WHERE name = :name', array(':name' => $this->name))->fetchField();
    }

    public function createItem($data)
    {
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
                'created'   => intval(time()),
            ));
        return (bool) $query->execute();
    }

    public function claimItem($lease_time = 5)
    {
        // Claim an item by updating its expire fields. If claim is not successful
        // another thread may have claimed the item in the meantime. Therefore loop
        // until an item is successfully claimed or we are reasonably sure there
        // are no unclaimed items left.
        $claim    = mt_rand(1, 999999);
        /// we can't loop longer than the script is allowed to run
        $max_time = intval(ini_get('max_execution_time'));
        if ( $max_time === 0 ) { $max_time = 10; }
        /// lease time between 1->max_execution_time
        $lease_time = min($max_time,max(1,intval($lease_time)));
        $start = time();
        $end   = $start+$lease_time;
        /// loop for one lease-time interval, waiting for an item to open up
        while ( ($now=time()) <= $end )
        {
            /// make sure claim is atomic
            try
            {
                $claimed = db_query(
                    "UPDATE
                        {cds_queue}
                     SET   expire=:expire,
                           claim=:claim
                     WHERE name=:name
                       AND expire<:now
                     ORDER BY created, item_id ASC
                     LIMIT 1",
                     array( ':expire' =>intval($now+$lease_time),
                            ':claim'  =>intval($claim),
                            ':name'   =>$this->name,
                            ':now'    =>intval($now))
                )->rowCount();
                db_query('COMMIT');
            } catch ( Exception $e ) {
                // _cdsc_log('DBG: CDSC '.__FUNCTION__.'.'.__LINE__.' code:'.$e->getCode());
                if ( $e->getCode()==40001 ) { continue; }
                else { throw $e; }
            }
            // if there weren't any open items
            if ( empty($claimed) )
            {
                /// find out if there are active/claimed items
                /// that might come our way before our time limit
                try
                {
                    $active_items = db_query(
                        "SELECT count(*)
                         FROM {cds_queue}
                         WHERE name=:name
                           AND expire>=:now",
                        array(':name'=>$this->name,
                              ':now'=>intval($now))
                    )->fetchColumn();
                } catch ( Exception $e ) {
                    // _cdsc_log('DBG: CDSC '.__FUNCTION__.'.'.__LINE__.' code:'.$e->getCode());
                    if ( $e->getCode()==40001 ) { continue; }
                    else { throw $e; }
                }
                /// if there are no active/claimed items
                if ( empty($active_items) )
                {
                    return FALSE;
                }
                /// take a deep breath and try again
                usleep(100);
                continue;
            }
            /// we think we have claimed an item
            /// find the item we just claimed
            try
            {
                $item = db_query(
                    "SELECT data, data_uuid, item_id
                     FROM   {cds_queue}
                     WHERE  claim=:claim",
                     array(':claim'=>intval($claim))
                )->fetchObject();
            } catch ( Exception $e ) {
                // _cdsc_log('DBG: CDSC '.__FUNCTION__.'.'.__LINE__.' code:'.$e->getCode());
                if ( $e->getCode()==40001 ) { continue; }
                else { throw $e; }
            }

            if ( !empty($item) )
            {
                $item->data = unserialize($item->data);
                return $item;
            }
            /// we didn't see the item we thought we claimed
            /// take a deep breath and try again
            usleep(100);
            continue;
        }
        /// our time is up
        return FALSE;
    }

    public function releaseItem($item)
    {
        $retry = 0;
        while ( $retry++ <= 5 )
        {
            try
            {
                $released = db_query(
                    "UPDATE
                        {cds_queue}
                     SET   expire=0,
                           claim=0
                     WHERE item_id=:item_id",
                     array(':item_id'=>$item->item_id)
                )->rowCount();
                db_query('COMMIT');
                return $released;
            } catch ( Exception $e ) {
                if ( $e->getCode()==40001 )
                {
                    usleep(100);
                    continue;
                } else { throw $e; }
            }
        }
        return 0;
        // $update = db_update('cds_queue')
        //     ->fields(array(
        //         'expire' => 0,
        //         'claim'  => 0,
        //     ))
        //     ->condition('data_uuid', $item->data_uuid)
        //     ->execute();
        // db_query('COMMIT');
    }

    public function deleteItem($item)
    {
        $retry = 0;
        while ( $retry++ <= 5 )
        {
            try
            {
                $deleted = db_query(
                    "DELETE FROM
                        {cds_queue}
                     WHERE item_id=:item_id",
                     array(':item_id'=>$item->item_id)
                );
                db_query('COMMIT');
                return;
            } catch ( Exception $e ) {
                if ( $e->getCode()==40001 )
                {
                    usleep(100);
                    continue;
                } else { throw $e; }
            }
        }
        // db_delete('cds_queue')
        //     ->condition('data_uuid', $item->data_uuid)
        //     ->execute();
        // db_query('COMMIT');
    }

    public function deleteQueue()
    {
        db_delete('cds_queue')
            ->condition('name', $this->name)
            ->execute();
    }

}
