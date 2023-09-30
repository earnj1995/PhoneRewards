<?php
if(!defined('API')) die();

$input = $_GET;

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

$existing = $database->fetch('SELECT id FROM users WHERE phonenumber = ?', array($phone));
if(count($existing) > 0)
    error(409, 'Customer already exists');

if($database->execute('INSERT INTO users (id, phonenumber, name) VALUES (NULL, ?, ?)', array($phone, $input['name'])) === false)
    error(500, 'Failed to add customer');

echo(json_encode(array('success' => true)));
?>