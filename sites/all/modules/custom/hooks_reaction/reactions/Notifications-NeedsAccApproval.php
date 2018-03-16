<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to notify the Accessibility-Team when a node is moved into
    the "Needs Accessibility Approval" workflow-state. An email must also be sent to
    fcic-accessibility-team@gsa.gov

    [--] TICKET HISTORY [--]

    2015-07-07 - Created to resolve ticket: usagov-100473 Would like to modify workflow so that [...]

*/

/**
 * Implements HOOK_workbench_moderation_transition
 *
 * This hook fires whenever a node moves from one workflow state to another.
 */
hooks_reaction_add("HOOK_workbench_moderation_transition",
    function ($node, $previous_state, $new_state) {

        // if this node is moving into the "Needs Accessibility Approval" workflow-state...
        if ( $new_state === 'needs_acc_approval' ) {

            informAccTeamOfMultNeedingApproval($node);
        }
    }
);

function informAccTeamOfMultNeedingApproval($node) {

    // We must always email this address
    //$strTo = 'fcic-accessibility-team@gsa.gov, dfrey@ctacorp.com';

    $role = user_role_load_by_name('accessibility team');
    $uids = db_select('users_roles', 'ur')
        ->fields('ur', array('uid'))
        ->condition('ur.rid', $role->rid, '=')
        ->execute()
        ->fetchCol();
    $users = user_load_multiple($uids);
    $acc_user = array();
    $acc_user[] = 'achuluunkhuu@ctacorp.com';

    foreach($users as $user) {
        $acc_user[] = $user->mail;
    }
    $strTo = join(',', $acc_user);

    // We check and prevent developer's locals from sending emails here
    $prodStageDomains = variable_get('udm_prod_domains', array());
    if ( !in_array($_SERVER['HTTP_HOST'], $prodStageDomains) ) {

        // then we are running on someone's local, do NOT send the email to the normal destination
        drupal_set_message(__FUNCTION__."() notification email is NOT beening sent to {$strTo} because "
            ."this is NOT the STAGE, nor is it PROD, environment. Instead it is being sent to dfrey@ctacorp.com");

        $strTo = 'achuluunkhuu@ctacorp.com';
    }

    // Email Subject
    $params['subject'] = "Asset Needing Acc. Approval: ".$node->title. _get_env_string();

    // Email message body
    $linkToNode = "https://".$_SERVER['HTTP_HOST']."/node/".$node->nid."/edit";
    $nodeAnchor = l($node->title, $linkToNode);
    $linkToAccApprovalDashboard = "https://".$_SERVER['HTTP_HOST']."/admin/workbench/needs-acc-approval";
    $params['body'] = '';

    if ( $_SERVER['HTTP_HOST'] !== 'usagov.platform.gsa.gov' && $_SERVER['HTTP_HOST'] !== 'cmp.ctacdev.com' ) {
        $params['body'] .= '<span style="color: red">Note: This message was dispatched from the '
            .'CMP Staging environment.<br/>When this type of notification is sent from the production '
            .'environment, this message with not be perpended.</span><br/><br/><hr/><br/>';
    }

    $params['body'] .= 'This is an automated message to inform you that the an Asset named "'
        . $nodeAnchor . '" is needing approval from the Accessibility Team<br/><br/>';
    $params['body'] .= 'This asset was last updated on; ' . date('Y-m-d \a\t g:ia').'<br/>';
    $params['body'] .= "<br/>";
    $params['body'] .= "You can edit this node from: ".l($linkToNode, $linkToNode)."<br/><br/>";
    $params['body'] .= "Also note that you can always view all content needing Accessibility-Approval from: "
        .l($linkToAccApprovalDashboard, $linkToAccApprovalDashboard);

    // Email headers
    $from = variable_get('site_mail', '');
    // $params['from'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . $from . '>');
    // $params['headers']['Reply-To'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . variable_get('site_mail', '') . '>');
    $params['from'] = trim(variable_get('site_name', "CMP USA.gov") . ' <' . $from . '>');
    $params['headers']['Reply-To'] = trim(variable_get('site_name', "CMP USA.gov") . ' <' . variable_get('site_mail', '') . '>');

    /* Based on the first parameter to drupal_mail(), notifyTaxonomyEmpty_mail() will
    be called and used to determine the email-message to send. */
    try {
      $res = drupal_mail(
          'cmp_misc',
          'needs-approval-notification',
          $strTo,
          language_default(),
          $params,
          $params['from']
      );
    } catch(Exception $e) {
      watchdog('cmp mailer',__FUNCTION__.' : '.$e->getMessage() );
      return;
    }

    if ($res["send"]) {
        drupal_set_message('Notified the Accessibility-Team that this content needs Accessibility-Approval. '
            .'Notification email has been sent to: ' . $strTo. _get_env_string());
    }

}
