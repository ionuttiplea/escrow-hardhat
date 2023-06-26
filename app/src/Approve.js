
export default function Approve({
    address,
    approved,
    handleApprove
}) {
    console.log(approved);
    if ( ! approved ) {
        return (
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
        );
    } else {
        return (
            <div
              className="complete"
              id={address}
            >
              ✓ It's been approved!
            </div>
            );
    }
}