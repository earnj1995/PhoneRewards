<?php
if(!defined('API')) die();

ValidateClerkCode();

$input = $_POST;

assertData($input, array(        
    'message' => 'string'    
));

$userids = $database->fetch('SELECT id FROM users');

$query = 'INSERT INTO smsjobs (id, userid, message) VALUES ';
$idx = 0;

$values = array();
foreach($userids as $userid)
{
    if($idx !== 0)
    {
        $query .= ', ';
    }
    $query .= '(NULL, :userid' . $idx . ', :message' . $idx . ')';
    $values[':userid' . $idx] = $userid['id'];
    $values[':message' . $idx] = $input['message'];
    $idx++;
}

if($database->execute($query, $values) !== true)
    error(500, 'Failed to queue SMS messages');

echo(json_encode(array('success' => true)));
?>