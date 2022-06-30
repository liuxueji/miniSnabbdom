export default function (sel, data, children, text, elm) {
  let key = data.key
  return {
    sel,
    data,
    key,
    children,
    text,
    elm
  }
}