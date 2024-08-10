import React from 'react'

export default function Contact() {
  return (
    <div className="flex justify-center">
      <div className="w-2/3">
        <h1 className="text-bold text-4xl text-center m-4">Contact Us</h1>
        We are bound to give our customer our top-notch services. For any
        complaints, feedback or queries via telephone or email.
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h6 className="font-bold">ONLINE SALES / CUSTOMER SERVICES</h6>
            <p>
              CHENNAI PLAZA
              <br />
              277/30, Pycrofts road
              <br />
              Tamil Nadu
              <br />
              Chennai - 600005
            </p>
            <p>
              Tel <a href="tel:+919566044092">+91 9566044092</a>
              <br />
              Email: customer.cpzeeba@gmail.com <br />
              Our Showroom functions from Monday to Saturday from 9:00 AM to
              9:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
