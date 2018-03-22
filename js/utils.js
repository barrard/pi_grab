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

    return `${Math.round(days%365)} Days, ${Math.round(hours%24)} Hours, ${Math.round(minutes%60)} Minutes, ${Math.round(seconds%60)} seconds`
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