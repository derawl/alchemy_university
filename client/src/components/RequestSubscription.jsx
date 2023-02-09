import React from 'react'

const RequestSubscription = ({ subscribe }) => {
    return (
        <div>
            <div>
                <h2>Title</h2>
                <button onClick={subscribe}>Subscribe</button>
            </div>
        </div>
    )
}

export default RequestSubscription