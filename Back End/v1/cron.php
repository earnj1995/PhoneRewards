<?php
require_once('resources/api.config.php');
require_once('resources/database.php');
$database = Database::GetDatabase();

$lastCron = $database->fetch('SELECT value FROM system WHERE name = ?', array('lastcron'));
if(count($lastCron) > 0)
    $lastCron = $lastCron[0]['value'];
else
    $lastCron = '';

if($lastCron != '' && strtotime($lastCron) > strtotime('-45 seconds'))
    die('Job(s) ran too recently.');

$jobs = $database->fetch('SELECT smsjobs.id, userid, phonenumber, message FROM smsjobs INNER JOIN users ON users.id = smsjobs.userid ORDER BY ID ASC LIMIT 10');

foreach($jobs as $job)
{ 
//write a curl request to Telnyx to send a message

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.telnyx.com/v2/messages');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . TELNYX_API_KEY
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);        
    
    $data = array(
        'from' => TELNYX_PHONE_NUMBER,
        'to' => '+1' . $job['phonenumber'],
        'text' => $job['message']
    );
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if($responseCode !== 200)
    {
        $database->execute('INSERT INTO failedjobs (jobid, userid, message, response) VALUES (?, ?, ?, ?)', array($job['id'], $job['userid'], $job['message'], $responseCode . '\n' . $response));
    }

    $database->execute('DELETE FROM smsjobs WHERE id = ?', array($job['id']));        
}

$database->execute('REPLACE INTO system (name, value) VALUES (?, ?)', array('lastcron', date('Y-m-d H:i:s')));
?>