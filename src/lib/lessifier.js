import less from 'less';

export default (code, option) => 
  less.render(code, option).then(output => output.css);
