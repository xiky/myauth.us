<?php

//fix
require_once('classes/Authenticator.php');
include('includes/config.php');
$topnavvalue = "添加安全令";
include('includes/html_toubu/html_toubu.php');
include('includes/page_inc/header_normal.php');
if ($logincheck == 0) {
    $navurladd = SITEHOST . "welcome.php";
    $topnavvalue = "WELCOME";
    include('includes/page_inc/welcome_inc.php');
} else {
    $query = "SELECT * FROM `users` WHERE `user_name`='$user'";
    $rowtemp = queryRow($query);
    $user_id = $rowtemp['user_id'];
    $user_right = $rowtemp['user_right'];
    $sql = "SELECT * FROM `authdata` WHERE `user_id`='$user_id'";
    if (queryNum_rows($sql) < MOST_AUTH) {
        try {
            include('includes/auth_add/authadd_byserver.php'); //生成AUTH用
        } catch (Exception $exc) {
            $authaddbyservererrorid = 5;
        }
    } else {
        $authaddbyservererrorid = 6;
    }
    switch ($authaddbyservererrorid) {

        case 0:
            $jumptxt = "申请成功，即将跳转到该安全令页面。";
            if ($auth_moren == 1)
                $jumpurl = SITEHOST . "auth.php";
            else
                $jumpurl = SITEHOST . "normalauth.php?authid=" . $auth_id;
            break;
        case 1:
            $jumptxt = "填写的内容有误，请返回检查后再试。";
            $jumpurl = SITEHOST . "addauth.php";
            break;
        case 2:
            $jumptxt = "填写的内容有误，请返回检查后再试。";
            $jumpurl = SITEHOST . "addauth.php";
            break;
        case 3:

            $jumptxt = "不要这样吧，不登入也想玩？即将返回主页。";
            $jumpurl = SITEHOST . "index.php";
            break;
        case 4:
            $jumptxt = "验证码错误，请返回重试。";
            $jumpurl = SITEHOST . "addauth.php";
            break;
        case 5:
            $jumptxt = "生成失败，请稍后重试。";
            $jumpurl = SITEHOST . "addauth.php";
            break;
        case 6:
            $jumptxt = "你已经拥有" . MOST_AUTH . "枚安全令了，不能再多了。即将返回主页";
            $jumpurl = SITEHOST . "index.php";
            break;
        default :
            $jumptxt = "未知错误，要不去找下鹳狸猿吧。";
            $jumpurl = SITEHOST . "addauth.php";
    }
    include('includes/auth_jump/auth_server_jump.php');
}
include('includes/page_inc/footer.php');
?>