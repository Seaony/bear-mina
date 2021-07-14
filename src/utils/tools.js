var tools = {
  strtotime: function (dateTimeStr) {
    return new Date(dateTimeStr.replace(/-/g, '/')).getTime()
  }
}

export default tools
