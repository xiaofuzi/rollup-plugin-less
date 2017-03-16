import {injectFnName} from './consts';
import styleAppender  from './style-appender';

let stringified = styleAppender.toString().replace(/styleAppender/, injectFnName);

export default insert => insert ? stringified : '';
