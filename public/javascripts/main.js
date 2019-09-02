$(window).on("load", function() {
    // $.fn.editable.defaults.mode = 'popup';
    $(".update-role").editable({
        mode: "popup",
        params: function(params) {
            params.type = $(this).attr('data-pk') == "false" ? `INSERT` : `UPDATE`,
            params.user_id = $(this).attr('data-user-id');
            params.pk = $(this).attr('data-pk');
            return params;
        },
        source: [
            { value: "", text: "Select Role" },
            { value: 1, text: "Admin" },
            { value: 2, text: "Superadmin" },
            { value: 3, text: "User" }
        ],
        url: "/user/update-role",
        title: "Update User Role",
        success: function(response,newValue) {
            if(response.insertId) {
                $(this).attr('data-pk',response.insertId)
            }
            console.log(newValue)
        }
    });
});
