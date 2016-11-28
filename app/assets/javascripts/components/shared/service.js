export function get(url, data, successfulCallback, failedCallback) {
  return request(url, 'GET', data, successfulCallback, failedCallback)
}

export function post(url, data, successfulCallback, failedCallback) {
  return request(url, 'POST', data, successfulCallback, failedCallback)
}

export function destroy(url, data={}, successfulCallback) {
  return request(url, 'DELETE', data, successfulCallback)
}

export function put(url, data={}, successfulCallback) {
  return request(url, 'PUT', data, successfulCallback)
}

function request(url, method, data, successfulCallback, failedCallback) {
  return $.ajax({
    url: url,
    method: method,
    data: JSON.stringify(data),
    contentType: 'application/json'
  }).done(function(result){
    if(successfulCallback) {
      successfulCallback(result)
    } else {
      alert(result.message)
    }
  }).fail(function(result){
    if(failedCallback) {
      failedCallback(result)
    } else {
      alert(result.responseText)
    }
  })
}

export function fileRequest(url, data, successfulCallback, failedCallback) {
  return $.ajax({
    url: url,
    method: 'POST',
    data: data,
    processData: false, // Don't process the files
    contentType: false
  }).done(function(result){
    if(successfulCallback) {
      successfulCallback(result)
    } else {
      alert(result.message)
    }
  }).fail(function(result){
    if(failedCallback) {
      failedCallback(result)
    } else {
      alert(result.responseText)
    }
  })
}