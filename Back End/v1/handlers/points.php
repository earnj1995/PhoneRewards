<?php
if(!defined('API')) die();

$input = $_GET;

assertData($input, array(        
    'phone' => 'string'
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

$customer = $database->fetch('SELECT id,name,phonenumber,balance FROM users LEFT JOIN balance ON balance.userid = users.id WHERE phonenumber = ?', array($phone));


if(count($customer) > 0)
{
    if(!isset($customer['balance']) || $customer['balance'] === null)
        $customer['balance'] = 0;
    $customer = $customer[0];   
    $customer['id'] = intval($customer['id']);
    $customer['balance'] = floatval($customer['balance']);
    $customer['__type'] = 'Customer';
    echo(json_encode($customer));
}
else
    error(404, 'Customer not found');
?>