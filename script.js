(function () {
  emailjs.init("S91z-Z0yh9PrmztA5");
  
  toastr.options = {
    "closeButton":true,
     "positionClass":"toast-bottom-right",
     "timeOut":"5000",
     "hideDuration": "300",
    "showDuration": "300"
  }


})();

function sendMail() {
  var name = document.querySelector("#user_name").value;
  var email = document.querySelector("#user_email").value;
  var message = document.querySelector("#message").value;
  var time = new Date().toLocaleString();

  if (name === "" || email === "" || message === ""){
    toastr.warning("Please Fill All the Required Fields", "Warning");
    return;
  }

  var params = {
    name: name,
    email: email,
    message: message,
    time: time
  };

  emailjs.send("service_wknc66c", "template_uz69m2q", params)
    .then(function (response) {
    toastr.success("Message Sent Successfully","Success")
    document.querySelector("#contact-form").reset();
    }, function (error) {
    toastr.error("Something went wrong, Try again Later","Error")
      console.error(error);
    });
}

    var form = document.querySelector("#contact-form");
    form.addEventListener("submit", function (e) {
    e.preventDefault();
    sendMail();
    });


  var hamburgerBtn = document.querySelector('#hamburgerBtn');
  var navWrapper = document.querySelector('#navWrapper');
  var iconBars = hamburgerBtn.querySelector('.fa-bars');
  var iconClose = hamburgerBtn.querySelector('.fa-times');

  hamburgerBtn.addEventListener('click', () => {
    navWrapper.classList.toggle('show');
    iconBars.classList.toggle('d-none');
    iconClose.classList.toggle('d-none');
  });



    var tabs = document.querySelectorAll(".skill-tab");
    var skills = document.querySelectorAll(".skill-item");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            var selectedGroup = this.getAttribute("data-tab");

            skills.forEach(skill => {
                if (skill.getAttribute("data-group") === selectedGroup) {
                    skill.classList.remove("d-none");
                } else {
                    skill.classList.add("d-none");
                }
            });  
        });
    });

    if (tabs.length > 0) {
        tabs[0].click();
    }



