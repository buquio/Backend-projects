
// till working on this please 

// https://api.enye.tech/v1/challenge/records
//       1. Using the Profiles API, create a UI that presents the information intuitively and beautifully
//       2. Only 20 profiles **must** be listed on a page, so pagination is needed 
//       3. Your application **must** incorporate two (2) filters to dynamically present the information 
//       (i.e. filter by gender, payment method, credit card type, etc.)
//       4. Your application **must** include a search bar to search for a specific patient
//       5.You must submit a link to the client and
//       6.You must submit a link to the Github code **7 days** after applying to the program.


async function getRecords() {
    const recordFetch = await fetch("https://api.enye.tech/v1/challenge/records");
    const recordJson = await recordFetch.json();
    // console.log("recordJson:", recordJson);
   
 
    const records = document.querySelector(".records");
    let html = "";
    
    recordJson.slice(0, 20).forEach((record) => {
      const firstName = record.profile.FirstName;
      const lastName = record.profile.LastName;
      const gender = record.profile.Gender;
      let latitude = record.profile.Latitude;
      let longitude = record.profile.Longitude;
      let creditCardNumber = record.profile.CreditCardNumber;
      let creditCardType = record.profile.CreditCardType;
      const email = record.profile.Email;
      const domainName = record.profile.DomainName;
      const phoneNumber = record.profile.PhoneNumber;
      const macAddress = record.profile.MacAddress;
      const url = record.profile.URL;
      const userName = record.profile.UserName;
      const lastLogin = record.profile.LastLogin;
      let paymentMethod = record.profile.PaymentMethod

  
      // .............still working on this: suggest the i look for a nice profile page-copy/do the html & css,then put
      // in the varoius data form the api e.g <div class="first-name">${firstName}</div>

      html += `
      <div class="wrapper">
    <h2>Records</h2>
    <form>
      <div class="input-group close">
      <h4> Profiles API</h4>
        <div class="input-box">
          <div type="text" placeholder="FirstName" required class="name">${firstName}</div>
          <i class="fa fa-user icon"></i>
        </div>
        <div class="input-box">
          <div type="text" placeholder="lastName" required class="name">${lastName}</div>
          <i class="fa fa-user icon"></i>
        </div>
        <div class="input-box">
        <div type="text" placeholder="domainName" required class="name">${domainName}</div>
        <i class="fa fa-envelope"></i>
      </div>
      <div class="input-box">
        <div type="text" placeholder="userName" required class="name">${userName}</div>
        <i class="fa fa-envelope"></i>
      </div>
      </div>

      <div class="input-group">
        <div class="input-box">
          <div type="email" placeholder="email" required class="name">${email}</div>
          <i class="fa fa-envelope"></i>
        </div>
        <div class="input-box">
        <div type="text" placeholder="macAddress" required class="name">${macAddress}</div>
        <i class="fa fa-envelope"></i>
      </div>
      <div class="input-box">
      <div type="tel" placeholder="phoneNumber" required class="name">${phoneNumber}</div>
      <i class="fa fa-envelope"></i>
    </div>
    <div class="input-box">
      <div type="tel" placeholder="url" required class="name">${url}</div>
      <i class="fa fa-envelope"></i>
    </div>
      </div>

      <div class="input-group">
        <div class="input-box">
          <h4 class="gender">Gender</h4>
          <div type="radio" name="gender" checked id="b1" class="radio">${gender}</div>
          <label for="b1">Gender</label>
        </div>
      </div>

      <div class="input-group">
        <div class="input-box">
          <h4>Payment Details</h4>
          <div type="radio" name="pay" id="bc1" checked class="radio">${paymentMethod}</div>
          <label for="bc1">
            <span><i class="fa fa-credit-card icon"></i></span>
          </label>
          </div>
          <div type="radio" name="pay" id="bc1" checked class="radio">${creditCardType}</div>
          <label for="bc1">
            <span><i class="fa fa-credit-card icon"></i></span>
          </label>
          </div>
          <div class="input-box">
          <select>
            <option><i class="fa fa-cc-visa"> Visa </i></option>
            <option><i class="fa fa-cc-paypal"> Paypal </i></option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-box">
          <div type="tel" class="name" placeholder="card number" required>${creditCardNumber}</div>
          <i class="fa fa-credit-card icon"></i>
        </div>
      </div>

      <div class="input-group">
        <div class="input-box">
          <div type="tel" required placeholder="latitude">${latitude}</div>
          <i class="fa fa-user icon"></i>
        </div>
        <div class="input-box">
          <div type="tel" required placeholder="longitude">${longitude}</div>
          <i class="fa fa-user icon"></i>
        </div>
        <div class="input-box">
          <div type="tel" required placeholder="lastLogin">${lastLogin}</div>
          <i class="fa fa-user icon"></i>
        </div>
      </div>

      
      </div>

    </form>
    </div>

      `;
    });
  
    records.innerHTML = html;
  }
  
  getrecords();
  
 

////////////////////
// html += `
//         <div class="profile">
//           <img class="profile__image" src="${image}" />

//           <div class="profile__details">
//             <div class="profile__sub-title">${roomType}</div>
//             <div class="profile__title">${name}</div>
//             <small class="profile__rooms">${guests} · ${bedrooms} · ${beds} · ${baths}</small>
//             <small class="profile__amenities">${amenities}</small>

//             <div class="profile__bottom">
//               <div class="profile__stars">&star; <strong>${stars}</strong> (${reviewers})</div>
//               <div class="profile__price"><strong>$${price}</strong> / night</div>
//             </div>

//           </div>  
//         </div>
//       `;
//     });
  
//     records.innerHTML = html;
//   }
  
//   getrecords();
