<?php
if(!defined('API')) die();

$input = $_POST;

assertData($input, array(        
    'phone' => 'string',
    'name' => 'string'
));

$phone = trim($input['phone']);
$phone = str_replace(' ', '', $phone);
$phone = str_replace('-', '', $phone);
$phone = str_replace('(', '', $phone);
$phone = str_replace(')', '', $phone);
$phone = str_replace('.', '', $phone);
$phone = str_replace('+', '', $phone);
if(strlen($phone) === 11 && $phone[0] == '1')
    $phone = substr($phone, 1);

if(strlen($phone) !== 10 || !is_numeric($phone))
    error(400, 'Invalid phone number');

if(strlen($input['name']) < 2)
    error(400, 'Invalid name');

$existing = $database->fetch('SELECT id FROM users WHERE phonenumber = ?', array($phone));
if(count($existing) > 0)
    error(409, 'Customer already exists');

if($database->execute('INSERT INTO users (id, phonenumber, name) VALUES (NULL, ?, ?)', array($phone, $input['name'])) === false)
    error(500, 'Failed to add customer');

$user = $database->fetch('SELECT id FROM users WHERE phonenumber = ?', array($phone));
if(count($user) === 0)
    error(500, 'Failed to add customer');

if($database->execute('INSERT INTO smsjobs (id, userid, message) VALUES (NULL, ?, ?)', array($user[0]['id'], WELCOME_MESSAGE)) !== true)
    error(500, 'Failed to add welcome message');

echo(json_encode(array('success' => true)));
?>