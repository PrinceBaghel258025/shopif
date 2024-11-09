import Story from "./Story";

export default function App({ home }) {
  console.log("Home", home);

  const productId = window.productId;
  const productHandle = window.productHandle;

  console.log("PRODUCT INFO: ", productId, "productHandle", productHandle);

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
      <Story />
    </div>
  );
}
