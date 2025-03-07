import { log } from "console";

const test = () => {
	var b: number = 1;
	const a = {
        c: () => {
            b = b + 1;
            log(b);
       },
       d: () => {
           b = b * 2;
           log(b);
       }
    }
	return a;
};

export default test();