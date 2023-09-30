<?php
if(!defined('API')) die();

ValidateClerkCode();

$input = $_GET;

assertData($input, array(        
    'customerid' => 'int',
    'points' => 'int'
));

$input['points'] = max(-1000, $input['points']);
$input['points'] = min(1000, $input['points']);

if($database->execute('INSERT INTO transactions (userid, points, time) VALUES (?, ?, NOW())', array($input['customerid'], $input['points'])) === false)
    error(500, 'Failed to add points');

$total = $database->fetch('SELECT SUM(points) AS total FROM transactions WHERE userid = ?', array($input['customerid']));
$total = $total[0]['total'];
    
if($database->execute('REPLACE INTO balance(userid, balance) VALUES (?, ?)', array($input['customerid'], $total)) === false)
    error(500, 'Failed to update balance');

echo(json_encode(array('success' => true)));
?>