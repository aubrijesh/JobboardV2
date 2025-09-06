$(document).ready(function() {
    $(".edit").on("click", function() {
        var id = $(this).data("id");
        window.location.href = "/job_edit.html?id="+id;
    });
})