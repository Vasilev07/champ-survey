$(function () {
    const url = window.location.href.match(/[0-9a-zA-Z]+$/);
    let surveyData;
    console.log('here');
    $.ajax({
        method: "GET",
        async: true,
        url: "/" + url,
        beforeSend: function () {
            $(".spinner").show();
            $(".over").show();
        },
        error: function (error) {
            $(".spinner").hide();
            $(".over").hide();

            const body = $("body");
            const errorElement = document.createElement("h1");
            body.append(errorElement);
            $(errorElement).html(error.responseJSON.message)
                .css("text-align", "center");
        },
        success: function (survey) {
            setTimeout(function () {
                $(".spinner").hide();
                $(".over").hide();
            }, 600);

            surveyData = survey;
            console.log('asdasdasdasd', survey.questionData);
            console.log('surveyData',surveyData);
            const surveyWrapper = $("<div></div>");
            const questionWrapper = $("<div></div>");
            const thumbnailWrapper = $("<div></div>");
            const captionWrapper = $("<div></div>");
            const titleDiv = $("<div></div>");
            const catDiv = $("<div></div>");
            const dateDiv = $("<div></div>");
            const titleWrapper = $("<div></div>");

            surveyWrapper.addClass("col-xs-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 survey");
            thumbnailWrapper.addClass("thumbnail");
            captionWrapper.addClass("caption");

            titleDiv.addClass("survey-title col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4")
                .append($("<i></i>")
                    .addClass("fas fa-heading")
                    .tooltip({
                        title: "Survey title"
                    }))
                .append($("<span></span>")
                    .html(survey.name));

            catDiv.addClass("survey-cat col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4")
                .append($("<i></i>")
                    .addClass("fas fa-folder")
                    .tooltip({
                        title: "Category"
                    }))
                .append($("<span></span>")
                    .html(survey.categoryName));

            dateDiv.addClass("survey-date col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4")
                .append($("<i></i>")
                    .addClass("fas fa-calendar-alt")
                    .tooltip({
                        title: "Creation date"
                    }))
                .append($("<span></span>")
                    .html((survey.createdAt)
                        .replace("T", "")
                        .replace("Z", "")
                        .slice(0, 10)));

            titleWrapper.addClass("row")
                .append(titleDiv)
                .append(catDiv)
                .append(dateDiv);

            captionWrapper
                .append(titleWrapper)
                .append("<hr>");

            const form = $("#submit-survey");

            $("#main").append(surveyWrapper);
            survey.questionData.forEach(function (element, index) {
                const row = $("<div></div>");
                const formGroup = $("<div></div>");
                row.addClass("row");
                formGroup.addClass("form-group");

                let newElement;
                row.append(formGroup);
                if (element.questionType === "slider") {
                    newElement = window.previews.sliderPreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionType === "multiple-choice") {
                    newElement = window.previews.multipleChoicePreview(element, index + 1);
                    formGroup.className += " checkbox-group";
                    formGroup.append(newElement);
                } else if (element.questionType === "single-choice") {
                    newElement = window.previews.singleChoicePreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionType === "single-textbox") {
                    newElement = window.previews.singleTextboxPreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionType === "emojis") {
                    newElement = window.previews.emojisChoicePreview(element, index + 1);
                    formGroup.append(newElement);
                } else if (element.questionType === "date") {
                    newElement = window.previews.datePreview(element, index + 1);
                    formGroup.append(newElement);
                }
                row.append("<hr>");
                form.append(row);
            });

            window.previews.injectSliders(window.previews._slidersIds);
            window.previews.injectDates(window.previews._dateTimeIds);

            captionWrapper.append(form).addClass("info");

            const submitBtn = $("<button></button>");

            submitBtn.attr("id", "submit-survey-btn");
            submitBtn.addClass("btn btn-success");
            submitBtn.attr("type", "submit");
            submitBtn.attr("value", "Submit");
            submitBtn.html("Submit");
            form.append(submitBtn);
            surveyWrapper.append(thumbnailWrapper.append(captionWrapper));
        }
    });

    const validateCheckbox = function (requiredCheckbox) {
        let flag = true;
        requiredCheckbox.each(function (index, checkbox) {
            const selected = $(checkbox).children(".checkbox").find("input:checked");
            if (selected.length === 0) {
                flag = false;
            }
        });
        return flag;
    };

    $("#submit-survey").submit(function (e) {
        const submissionModal = $("#submission-survey-modal");
        e.preventDefault();
        const requiredCheckbox = $(".checkbox-group .required");
        const validate = validateCheckbox(requiredCheckbox);
        if (!validate) {
            console.log("error!");
            return false;
        }

        const serialize = $("#submit-survey").serializeArray();
        console.log('surveyData', surveyData);
        console.log('serialize', serialize);
        
        $.ajax({
            method: "POST",
            async: true,
            url: "/submit",
            data: {
                surveyData: JSON.stringify(surveyData),
                answer_data: JSON.stringify(serialize)
            },
            error: function (error) {
                submissionModal.modal("show");
                $("i.reject").show();
                $("span.reject").show();
            },
            success: function (resolve) {
                submissionModal.modal("show");
                $("i.success").show();
                $("span.success").show();

                $("#submission-survey-modal").on("hidden.bs.modal", function () {
                    window.location.href = "/index";
                });
            }
        });

        return false;
    });
});