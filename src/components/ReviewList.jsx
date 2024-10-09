const ReviewList = ({ reviews }) => {
    return (
      <div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>{review.name}</strong> ({new Date(review.date).toLocaleDateString()})</p>
              <p>Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
        
        <style jsx>{`
          .review {
            border-top: 1px solid #e1e1e1;
            padding-top: 10px;
            margin-top: 10px;
          }
        `}</style>
      </div>
    );
  };
  
  export default ReviewList;
  