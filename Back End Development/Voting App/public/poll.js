function checkOption(){
  if(document.getElementById("option_data_client").value == "add_custom_option"){
      document.getElementById("new_option_input").style.display = "block"
  }else{
    document.getElementById("new_option_input").style.display = "none"
  }
}