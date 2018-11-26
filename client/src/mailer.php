<?php if ($_SERVER["REQUEST_METHOD"] == "POST") {

$name = strip_tags(trim($_POST["form_name"]));
$name = str_replace(array("\r","\n"),array(" "," "),$name);
$subject = strip_tags(trim($_POST["form_subject"]));
$subject = str_replace(array("\r","\n"),array(" "," "),$subject);
$email = filter_var(trim($_POST["form_email"]), FILTER_SANITIZE_EMAIL);
$message = trim($_POST["form_msg"]);

// Check that data was sent to the mailer.
if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  // Set a 400 (bad request) response code and exit.
  setResponseCode(400);
  header("Content-type: application/json");
  $return_arr = array('success' => false, 'message' => 'Oops! There was a problem with your submission. Please complete the form and try again.');
  echo json_encode($return_arr);
  exit;
}

// Set the recipient email address.
// FIXME: Update this to your desired email address.
$recipient = "example@example.se";

// Set the email subject.
$subject = "New contact from $name";

// Build the email content.
$email_content = "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Subject: $subject\n\n";
$email_content .= "Message:\n$message\n";

// Build the email headers.
$email_headers = "From: $name <$email>";

// Send the email.
if (mail($recipient, $subject, $email_content, $email_headers)) {
  // Set a 200 (okay) response code.
  setResponseCode(200);
  header("Content-type: application/json");
  $return_arr = array('success' => true, 'message' => 'Thank you for contacting me, I will get back to you as soon as I can!');
  echo json_encode($return_arr);
} else {
  // Set a 500 (internal server error) response code.
  setResponseCode(500);
  header("Content-type: application/json");
  $return_arr = array('success' => false, 'message' => 'Oops! Something went wrong and we couldn’t send your message.');
  echo json_encode($return_arr);
}

} else {
  // Not a POST request, set a 403 (forbidden) response code.
  setResponseCode(403);
  header("Content-type: application/json");
  $return_arr = array('success' => false, 'message' => 'There was a problem with your submission, please try again.');
  echo json_encode($return_arr);
}

function setResponseCode($code, $reason = null) {
    $code = intval($code);

    if (version_compare(phpversion(), '5.4', '>') && is_null($reason))
        http_response_code($code);
    else
        header(trim("HTTP/1.0 $code $reason"));
}

?>
