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