const files = require.context('.', true, /.*(?<!index)\.js$/);
let styles = [];
files.keys().forEach(key => {
  let m = files(key).default;
  styles.push(m)

});
export default styles