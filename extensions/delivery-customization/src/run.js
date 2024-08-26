// @ts-check

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Operation} Operation
*/

export function run(input) {
  // The message to be added to the delivery option
  const message = "May be delayed due to weather conditions";

  let toRename = input.cart.deliveryGroups
    // Filter for delivery groups with a shipping address containing the affected state or province
    .filter(group => group.deliveryAddress)
    // Collect the delivery options from these groups
    .flatMap(group => group.deliveryOptions);

  // Sort delivery options: 'Standard' first, then by price, with free shipping at the bottom
  toRename.sort((a, b) => {
    // bring the below text to top
    if (a.title.includes("New")) return -1;
    if (b.title.includes("New")) return 1;
    //bring free to the bottom
    if (a.title.includes("Standard")) return 1;
    if (b.title.includes("Standard")) return -1;
    return a.price - b.price;
  });

  // Construct rename and move operations
  let operations = toRename.map((option, index) => {
    return [
      /** @type {Operation} */({
        rename: {
          deliveryOptionHandle: option.handle,
          title: option.title ? `${option.title} - ${message}` : message
        }
      }),
      /** @type {Operation} */({
        move: {
          deliveryOptionHandle: option.handle,
          index: index
        }
      })
    ];
  }).flat(); // Flatten the array of arrays

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations
  };
};
