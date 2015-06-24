/**
 * Password validation and strength rating.
 *
 * @copyright   2011, Blizzard Entertainment, Inc
 * @class       Password
 */var Password=Class.extend({passwordPattern1:new RegExp,passwordPattern2:new RegExp,maxRepetition:0,maxSequentiality:0,maxSimilarity:4,config:{},init:function(e){e=typeof e!="undefined"?e:{},this.config=$.extend({passwordPattern1:new RegExp("^[ -~]+$"),passwordPattern2:new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*).+$"),maxRepetition:2,maxSequentiality:4,maxSimilarity:4},e),e=this.config,this.passwordPattern1=e.passwordPattern1,this.passwordPattern2=e.passwordPattern2,this.maxRepetition=e.maxRepetition,this.maxSequentiality=e.maxSequentiality,this.maxSimilarity=e.maxSimilarity},check:function(e,t,n){e=typeof e!="undefined"?e:"",t=typeof t!="undefined"?t:"",n=typeof n!="undefined"?n:"";var r=[0,0,0,0,0];return e.length>0&&(e.length>=8&&e.length<=16?r[0]=1:r[0]=-1,this.passwordPattern1.test(e)?r[1]=1:r[1]=-1,this.passwordPattern2.test(e)?r[2]=1:r[2]=-1,r[3]=this.isSimilar(e,n),t===""?r[4]=0:e===t?r[4]=1:r[4]=-1),r},rate:function(e){e=typeof e!="undefined"?e:"";var t=0;return e.length>0&&(e.length>=8?this.passwordPattern1.test(e)&&this.passwordPattern2.test(e)&&e.length>10&&!this.hasRepetition(e)&&!this.hasSequentiality(e)?t=4:this.passwordPattern1.test(e)&&this.passwordPattern2.test(e)&&e.length>8&&!this.hasRepetition(e)&&!this.hasSequentiality(e)?t=3:t=2:t=1),t},hasRepetition:function(e){e=typeof e!="undefined"?e:"",t=typeof t!="undefined"?t:2;var t=this.maxRepetition,n="",r;for(var i=0,s=e.length;i<s;i++){r=!0;for(var o=0;o<t&&o+i+t<e.length;o++)r=r&&e.charAt(o+i)===e.charAt(o+i+t);o<t&&(r=!1),r?(i+=t-1,r=!1):n+=e.charAt(i)}return n.length-e.length<0},hasSequentiality:function(e){e=typeof e!="undefined"?e.toLowerCase():"";var t=this.maxSequentiality,n="abcdefghijklmnopqrstuvwxyz",r=n.split("").reverse().join(""),i="1234567890",s=i.split("").reverse().join(""),o="qwertyuiopasdfghjklzxcvbnm!@#$%^&*()_+",u=o.split("").reverse().join(""),a=" "+e.slice(0,t-1);for(var f=t,l=e.length;f<l;f++){a=a.slice(1)+e.charAt(f);if(n.indexOf(a)>-1||i.indexOf(a)>-1||o.indexOf(a)>-1||r.indexOf(a)>-1||s.indexOf(a)>-1||u.indexOf(a)>-1)return!0}return!1},isSimilar:function(e,t){if(e===""||t===""||e.length<this.maxSimilarity)return 1;e=e.toLowerCase(),t=t.toLowerCase();for(var n=0;n<=t.length-this.maxSimilarity;n++)if(e.indexOf(t.substring(n,n+this.maxSimilarity))>-1)return-1;return 1}}),ChangePassword=Class.extend({form:null,passwordInput1:null,passwordMessage1:null,passwordMessage1Default:null,passwordInput2:null,passwordMessage2:null,passwordMessage2Default:null,passwordRight:null,passwordLeft:null,passwordResult:null,passwordRating:null,passwordLevels:[],passwordGuidelines:null,passwordValidator:new Password,passwordValidated:!1,passwordTimer:null,showPasswordGuidelines:!1,activePasswordInput:-1,emailAddress:"",config:{},init:function(e,t){t=typeof t!="undefined"?t:{},e=$(e),e.length&&(e[0].tagName.toLowerCase()!=="form"&&(e=e.find("form")),this.form=e.length?e:null),this.form!==null&&(this.config=$.extend({passwordFields:["#password","#rePassword"],emailAddress:""},t),this.setup())},setup:function(){var e=this.form;this.submitButton=e.find("button[type=submit]"),this.passwordInput1=$(this.config.passwordFields[0]),this.passwordMessage1=$(this.config.passwordFields[0]+"-message"),this.passwordMessage1Default=this.passwordMessage1.text(),this.passwordInput2=$(this.config.passwordFields[1]),this.passwordMessage2=$(this.config.passwordFields[1]+"-message"),this.passwordMessage2Default=this.passwordMessage2.text(),this.passwordRight=this.passwordInput1.parents("span.input-right"),this.passwordLeft=this.passwordRight.siblings("span.input-left"),this.passwordResult=$("#password-result"),this.passwordRating=$("#password-rating"),this.passwordGuidelines=$("#password-strength"),this.emailAddress=this.config.emailAddress;for(var t=0;t<5;t++)this.passwordLevels[t]=$("#password-level-"+t);this.form.bind("submit",{form:this},function(e){var t=!1,n=!0,r=[];for(var i=0,s=this.length;i<s;i++){var o=$(this[i]);o.attr("required")&&!o.val()&&(t||(r.push(FormMsg.fieldInvalid),r.push(FormMsg.fieldsMissing),t=!0),n=!1)}return n&&(e.data.form.passwordValidated||(e.data.form.checkPassword(),e.data.form.passwordValidated||(r.push(FormMsg.passwordError1),r.push(FormMsg.passwordError2),n=!1))),n||($("#content").prepend(e.data.form.makeErrorBox(r)),window.location.href="#form-errors",e.preventDefault()),UI.enableButton(e.data.form.submitButton),n}),this.passwordInput1.bind("focus blur input",$.proxy(this._validatePassword,this)),Core.isIE&&this.passwordInput1.bind("keyup",$.proxy(this._validatePassword,this)),this.passwordInput2.bind("focus blur input",$.proxy(this._validatePassword,this))},_validatePassword:function(e){var t=e.type,n=e.target.id,r=this.passwordInput1[0].id,i=t==="keyup"||t==="input"||t==="propertychange"?100:0,s=this;return this.showPasswordGuidelines=!1,this.activePasswordInput=-1,t!=="blur"&&(this.activePasswordInput=n===r?0:1,this.showPasswordGuidelines=n===r),this.passwordTimer===null?(this.passwordTimer=setTimeout(function(){s.checkPassword()},i),!0):!1},checkPassword:function(){var e=this.passwordValidator,t=!0,n=this.passwordInput1[0].type==="password"?this.passwordInput1[0].value:"",r=this.passwordInput2[0].type==="password"?this.passwordInput2[0].value:"",i=this.passwordRight,s=this.passwordLeft,o=this.passwordMessage1,u=this.passwordMessage2,a=this.passwordMessage1Default,f=this.passwordMessage2Default,l=this.emailAddress,c=this.showPasswordGuidelines;if(n.length>0){i.removeClass("input-error"),s.removeClass("input-error");for(var h=0,p,d;d=e.check(n,r,l)[h];h++)p=this.passwordLevels[h],p.removeClass(),d===1?p.addClass("pass"):d===-1&&(i.addClass("input-error"),s.addClass("input-error"),p.addClass("fail"),t=!1);t||c?o.html(" "):(!t||u.html()===f||u.html()===" ")&&o.html(FormMsg.passwordError1)}else o.html(a),u.html(f),this.passwordLevels[0].removeClass(),this.passwordLevels[1].removeClass(),this.passwordLevels[2].removeClass(),this.passwordLevels[3].removeClass(),this.passwordLevels[4].removeClass(),t=!1;return this.ratePassword(),this.passwordValidated=t,t},ratePassword:function(){var e=this.passwordValidator,t=0,n=this.passwordInput1[0].type==="password"?this.passwordInput1[0].value:"",r=this.passwordRating,i=this.passwordResult,s=this.passwordMessage1,o=this.passwordMessage2;r.removeClass().addClass("rating rating-default"),i.html("").removeClass(),n.length>0&&(t=e.rate(n),t===4?(r.removeClass().addClass("rating rating-strong"),i.html(FormMsg.passwordStrength3)):t===3?(r.removeClass().addClass("rating rating-fair"),i.html(FormMsg.passwordStrength2)):t===2?(r.removeClass().addClass("rating rating-weak"),i.html(FormMsg.passwordStrength1)):t===1&&(r.removeClass().addClass("rating rating-short"),i.html(FormMsg.passwordStrength0).addClass("fail")));if(this.showPasswordGuidelines){s.html(" "),o.html(" ");var u=this.passwordGuidelines.find("div.input-note-arrow");this.passwordGuidelines.slideDown(250)}else this.passwordGuidelines.slideUp(125);this.passwordTimer!==null&&(clearTimeout(this.passwordTimer),this.passwordTimer=null)},enable:function(){this.submitButton.removeClass("disabled").removeAttr("disabled")},disable:function(){this.submitButton.addClass("disabled").attr("disabled","disabled")},makeErrorBox:function(e){$("#content .alert").remove();var t=e.length,n='<div class="alert error closeable border-4 glow-shadow"><div class="alert-inner"><div class="alert-message"><p class="title"><strong><a name="form-errors">'+FormMsg[t>1?"headerMultiple":"headerSingular"]+"</a></strong></p>";if(t>1){n+="<ul>";for(var r=0;r<t;r++)n+="<li>"+e[r]+"</li>";n+="</ul>"}else n+="<p>"+e[0]+"</p>";return n+="</div></div></div>",n}})