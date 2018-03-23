function format_date_time_stamp(_num){
    let date = new Date(_num)
    let seconds = date.getSeconds()
    let minutes = date.getMinutes()
    let hours = date.getHours()
    let day = date.getDate()
    let month = date.getMonth()+1
    let year = date.getFullYear()

    let _time_stamp = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
    return _time_stamp
  }

  function format_date_time_remaining(_seconds_remaining){
    var seconds = _seconds_remaining/1000
    var minutes = seconds/60
    var hours = minutes/60
    var days = hours/24
    var years = days/365

    // console.log({
    //   seconds, minutes, hours, days, years
    // })

    return `${Math.floor(days%365)} Days, ${Math.floor(hours%24)} Hours, ${Math.floor(minutes%60)} Minutes, ${Math.floor(seconds%60)} seconds`
  }


  // Crazy hamburger code
  var hamburger = true;
  document.getElementById('animated').addEventListener('click', function(e){
    console.log(this.children)
    var bars = this.children;
    var nav = document.getElementsByClassName('main-nav')[0]
    if (hamburger) {
        bars[0].classList.remove('upLeftFlat')
        bars[1].classList.remove('reappear')
        bars[2].classList.remove('downRightFlat')
        
        bars[0].classList.add('rotateRight')
        bars[1].classList.add('disolve')
        bars[2].classList.add('rotateLeft')
        hamburger = false
        //open main-nav
        nav.classList.add('open-nav')
    }else{
        bars[0].classList.add('upLeftFlat')
        bars[1].classList.add('reappear')
        bars[2].classList.add('downRightFlat')


        bars[0].classList.remove('rotateRight')
        bars[1].classList.remove('disolve')
        bars[2].classList.remove('rotateLeft')


    
        hamburger = true
        nav.classList.remove('open-nav')

    }

  }, true)


  // var dropDownBtnEl = document.getElementsByClassName('dropDownBtn')[0];
  // dropDownBtnEl.addEventListener('click', function(){
  //   this.classList.toggle('activeDrop')
  // }, false)
  function call_when_mined(txHash, callback){
    web3.eth.getTransactionReceipt(txHash, function(e, r){
      if(e){console.log(e)}
        else{
          if(r==null){
            setTimeout(function(){
              call_when_mined(txHash, callback)
            }, 500)
          }else{
            callback();
          }
        }
    })
  }

  function activate_spinner(_spinner){
    $(_spinner).css({display:'block'})
  }
  function hide_spinner(_spinner){
    $(_spinner).css({display:'none'})
  }


  var image_array = ['small-land-preview', 'doll-house', 'green-house']
  var carousel_counter = 0;
  function init_carousel(){
    var backBtn = $('#carousel-back-btn')
    var forwardBtn = $('#carousel-forward-btn')
    var carousel_el = $('.house-image')[0]
    $(carousel_el).css({'background-image':'url('+image_array[carousel_counter]+'.jpeg)'})

    $(backBtn).on('click', function(){
      carousel_counter--
      if(carousel_counter < 0){
        carousel_counter = image_array.length-1;
      }
      $(carousel_el).css({'background-image':'url('+image_array[carousel_counter]+'.jpeg)'})

    })
    $(forwardBtn).on('click', function(){
      carousel_counter++
      if(carousel_counter >= image_array.length){
        carousel_counter = 0;
      }
      $(carousel_el).css({'background-image':'url('+image_array[carousel_counter]+'.jpeg)'})

    })
  }

  function remove_all_active_tab(){
    const tabs = $('.tab')
    $.each(tabs, (i, v)=>{
      $(v).removeClass('active')
    })    
  }
  const tabs_data_array = ['Home', 'AVM']

  function hide_tabs_data(){
    const tabs = $('[data-tab]')
    $.each(tabs, (i, v)=>{
      $(v).hide();
    })

  }
  (()=>{
    $('[data-tab="Home"]').show()
  })()
  function init_property_tab_details(){
    // hide_tabs_data()
    const tabs = $('.tab')
    $.each(tabs, (i, v)=>{
      $(v).on('click', ()=>{
        remove_all_active_tab()
        $(v).addClass('active')
        const tab_data = $(v).text()
        console.log('show '+tab_data)
        hide_tabs_data()
        $('[data-tab="'+tab_data+'"]').show()
      })
    })
  }

  $(function() {
  $(window).on('load', function() {
    init_carousel();
    init_property_tab_details();

  });
});

