import { useParams } from "react-router-dom";

function FoodDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
          className="w-full h-96 object-cover"
        />

        <div className="p-8">

          <h1 className="text-4xl font-bold">
            Food #{id}
          </h1>

          <p className="text-gray-500 mt-4">
            Delicious food prepared by our chefs.
          </p>

          <button className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold">
            Add To Cart
          </button>

        </div>
      </div>
    </div>
  );
}

export default FoodDetails;