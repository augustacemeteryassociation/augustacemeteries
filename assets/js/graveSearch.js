$().ready(function() {
    
    $("#submit").click(function() {
        
    var fName = $("#fname").val();
    var lName = $("#lname").val();
    $("#results").empty();
    
//    clearInput();
        $(this).closest('form').find("input[type=text], textarea").val("");
    $("#results").text(`No Results found for: ${fName} ${lName}`);
    
    });
});

function clearInput(){
    $("#fname").empty();
    $("#lname").empty();
}