function encodeQueryParameter(input: string) {
  return encodeURIComponent(input).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

export default encodeQueryParameter;
