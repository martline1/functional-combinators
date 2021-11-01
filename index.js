// Pure Combinators
const I         = a => a;
const M         = a => a(a);
const K         = a => b => a;
const KI        = K(I);
const T         = K;
const F         = KI;
const not       = a => a(F)(T);
const C         = a => b => c => a(c)(b);
const and       = a => b => a(b)(a);
const or        = a => b => a(a)(b);
const toBoolean = booleanCombinator => booleanCombinator(true)(false);
const beq       = a => b => a(b)(not(b));
const eq        = beq;
const partial   = fn => arg => otherArg => fn(arg)(otherArg);
const partial$  = (fn, ...args) => (...otherArgs) => fn(...args, ...otherArgs);

// Lists
const pair     = first => second => ({ first, second });
const vector2  = x => y => ({ x, y });
const vector2$ = (x, y) => ({ x, y });

const head = p => p.first;
const tail = p => p.second;

const apply2$ = a => (b, c) => a(b)(c);

const argsToArr = fn => (...args) => fn(Array.isArray(args[0]) ? args.flat() : args);

const foldl = fn => argsToArr(list => value => list.reduce(apply2$(fn), value));
const foldr = fn => argsToArr(list => value => list.reduceRight(apply2$(fn), value));

// Helpers
const flip = C;

const compose = foldr(flip(I));
const pipe    = foldl(flip(I));

const listToArray = p => {
	let result = [];

	while (p) {
		result.push(head(p));

		p = tail(p);
	}

	return result;
};

const arrayToList = iter => {
	let result = null;

	for (const el of reverse(iter)) {
		result = pair(el)(result);
	}

	return result;
};

const rangeList = low => high => low > high
	? null
	: pair(low) (rangeList(low + 1)(high));

const mapList = f => p => p === null
	? null
	: pair(f (head(p))) (mapList (f) (tail(p)));

const map = f => arr => arr.map(f);

// Generators
const range = function* (low = 0, high = 0, step = 1) {
	for (let i = low; i < high; i += step) {
		yield i;
	}
};

const reverse = function* (iter) {
	yield* [...iter].reverse();
};

const take$ = function* (quantity, iter) {
	let counter = 0;

	for (const el of iter) {
		if (counter < quantity) {
			yield el;
			counter++;
		} else return;
	}
};

const take = quantity => iter => take$(quantity, iter);

const fibo = function* () {
    let val1 = 1;
    let val2 = 1;

    yield val1;
    yield val2;

    while (true) {
        val1 += val2;
        yield val1;

        val2 += val1;
        yield val2;
    }
};

const naturalNumbers = function* () {
	let number = 1;

	while (true) yield number++;
};

module.exports = {
	/**
	 * Identity, takes an argument and returns that argument
	 * @name Identity
	 * @function
	 * @example
	 * // Returns 5
	 * I(5);
	 * @example
	 * // Returns x => y => x;
	 * I(x => y => x);
	 */
	I,

	/**
	  * Mockingbird, takes an argument and returns that argument applied to itself
	  * @name Mockingbird
	  * @function
	  * @example
	  * // Returns (x => x)(x => x)
	  * M(x => x);
	  * @throws {Uncaught RangeError} - Maximum call stack size exceeded if M(M);
	 */
	M,

	/**
	  * Kestrel, the truth, takes two arguments and returns the first one
	  * @name Kestrel
	  * @function
	  * @example
	  * // Returns 1
	  * K(1)(0);
	 */
	K,

	/**
	  * Kite, false, the lie, takes two arguments and returns the second one
	  * @name Kite
	  * @function
	  * @example
	  * // Returns 0
	  * KI(1)(0);
	 */
	KI,

	/**
	  * Cardinal, not, returns the opposite
	  * @name Cardinal
	  * @function
	  * @example
	  * // Returns 1
	  * C(F)(1)(0);
	  * @example
	  * // Returns 0
	  * C(T)(1)(0);
	 */
	C,

	/**
	  * Kestrel, the truth, takes two arguments and returns the first one
	  * @name Truth
	  * @function
	  * @example
	  * // Returns 1
	  * T(1)(0);
	 */
	T,


	/**
	  * Kite, false, the lie, takes two arguments and return the second one
	  * @name Lie
	  * @function
	  * @example
	  * // Returns 0
	  * F(1)(0);
	 */
	F,

	/**
	  * Cardinal, not, returns the opposite
	  * @name Not
	  * @function
	  * @example
	  * // Returns 1
	  * not(F)(1)(0);
	  * @example
	  * // Returns 0
	  * not(T)(1)(0);
	 */
	not,

	/**
	  * And operator, returns true if both, p and q are true
	  * @name And
	  * @function
	  * @example
	  * // Returns T or x => y => x;
	  * and(T)(T);
	  * @example
	  * // Returns F or x => y => y;
	  * and(F)(T);
	 */
	and,

	/**
	  * Or operator, returns true if one of p or q is true
	  * @name Or
	  * @function
	  * @example
	  * // Returns T or x => y => x;
	  * or(F)(T);
	  * @example
	  * // Returns F or x => y => y;
	  * or(F)(F);
	 */
	or,

	/**
	  * Equal operator, returns true if p and b are equal
	  * @name BothEqual
	  * @function
	  * @example
	  * // Returns T or x => y => x;
	  * beq(T)(T);
	  * @example
	  * // Returns T or x => y => x;
	  * beq(F)(F);
	  * // Returns F or x => y => y;
	  * beq(T)(F);
	  */
	beq,

	/**
	  * Equal operator, returns true if p and b are equal
	  * @name BothEqual
	  * @function
	  * @example
	  * // Returns T or x => y => x;
	  * beq(T)(T);
	  * @example
	  * // Returns T or x => y => x;
	  * beq(F)(F);
	  * // Returns F or x => y => y;
	  * beq(T)(F);
	  */
	eq,

	/**
	 * Transforms a boolean combinator into JavaScript's boolean
	 * @function
	 * @example
	 * // Returns true
	 * toBoolean(T)
	 * @example
	 * // Returns false
	 * toBoolean(a => b => b)
	 */
	toBoolean,

	/**
	 * Takes a function and an argument and makes the first argument of the received
	 * function to be the received argument
	 * 
	 * @example
	 * const add  = a => b => a + b;
	 * const add3 = partial(add)(3);
	 * 
	 * // Returns 5
	 * add3(2);
	 */
	partial,

	/**
	 * Takes a function and an argument and makes the first argument of the received
	 * function to be the received argument (Not Currying)
	 * 
	 * @example
	 * const add  = (a, b) => a + b;
	 * const add3 = partial(add, 3);
	 * 
	 * // Returns 5
	 * add3(2);
	 */
	partial$,

	/** A set of functions to work with lists and iterables */
	lists : {
		pair,
		vector2,
		vector2$,
		head,
		tail,
		foldl,
		foldr,
	},

	/** A set of helpers functions */
	helpers : {
		flip,
		compose,
		pipe,
		listToArray,
		arrayToList,
		rangeList,
		mapList,
		map,
	},

	/** A set of functions to work with generators and iterators */
	generators : {
		/**
		 * Takes n elements from an iterator
		 * 
		 * @example
		 * const elements = [1, 2, 3, 4, 5];
		 * 
		 * // Returns [1, 2, 3]
		 * [...take$(3, elements)];
		 */
		take$,

		/**
		 * Takes n elements from an iterator
		 * 
		 * @example
		 * const elements = [1, 2, 3, 4, 5];
		 * 
		 * // Returns [1, 2, 3]
		 * [...take(3)(elements)];
		 */
		take,
	
		/**
		 * Returns an iterator with all natural numbers
		 */
		naturalNumbers,

		/**
		 * Returns an iterator with the fibonacci sequence
		 */
		fibo,

		/**
		 * Generates a range between two numbers [number1, number2) with the given step
		 */
		range,
	},
};
