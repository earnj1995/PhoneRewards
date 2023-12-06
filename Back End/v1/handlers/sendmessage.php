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

$blockedContent = array(
    'vape',
    'smoke',
    'cbd',
    'flower',
    'hemp',
    'kratom',
    'cigar',
    'cigarette',
    'tobacco',
    'nicotine',
    'juul',
    'vapor',
    'elf',
    'lost mary',
    'marijuana',
    'weed',
    'thc',
    'hhc',
    'delta 8',
    'delta8',
    'd8',
    'delta-8',
    'delta 10',
    'delta10',
    'd10',
    'delta-10',
    'delta 9',
    'delta9',
    'd9',
    'delta-9',
    'delta 11',
    'delta11',
    'd11',
    'delta-11',
    'hhc',
    'thc-p',
    'edible'
);

$cleanMessage = str_replace('.', '', strtolower($input['message']));

foreach($blockedContent as $blocked)
{
    if(stripos($cleanMessage, $blocked) !== false)
        error(400, 'Message contains blocked content');
}

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