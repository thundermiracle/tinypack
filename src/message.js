import hello from './hello';
import { world } from './world';
import extraWorld from './extra/world.js';

export default function message() {
  console.log(`${hello} ${world} -- ${extraWorld}`);
}
