type EarlyAccessEmailData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  interests: string[];
  referralCode?: string;
  siteUrl: string;
};

export function earlyAccessConfirmationEmail({
  name,
  city,
  interests,
  referralCode,
  siteUrl,
}: EarlyAccessEmailData) {
  const interestList =
    interests.length > 0
      ? interests
          .map(
            (interest) =>
              `<span style="
                display:inline-block;
                margin:4px 4px 4px 0;
                padding:7px 10px;
                border:1px solid #3a3a3c;
                background:#151517;
                color:#f4f0e8;
                font-size:11px;
                letter-spacing:1px;
                text-transform:uppercase;
              ">${interest}</span>`
          )
          .join("")
      : `<span style="color:#a9a39a;">All cultural categories</span>`;

  const referralBlock = referralCode
    ? `
      <div style="
        margin-top:24px;
        padding:20px;
        background:#151517;
        border:1px solid #c9a96e55;
        text-align:center;
      ">
        <div style="
          color:#a9a39a;
          font-size:10px;
          letter-spacing:2px;
          text-transform:uppercase;
          margin-bottom:10px;
        ">
          Your Invitation Code
        </div>

        <div style="
          color:#c9a96e;
          font-size:18px;
          letter-spacing:3px;
          font-weight:bold;
        ">
          ${referralCode}
        </div>
      </div>
    `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Encoreats</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#080809;
  font-family:Arial,Helvetica,sans-serif;
  color:#f4f0e8;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:40px 16px;">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    max-width:640px;
    background:#111113;
    border:1px solid #2b2b2d;
  "
>

<!-- HEADER -->
<tr>
<td style="
  padding:34px 36px;
  border-bottom:1px solid #2b2b2d;
  text-align:center;
">

  <div style="
    font-family:Georgia,serif;
    font-size:30px;
    letter-spacing:5px;
    color:#f4f0e8;
  ">
    ENCOREATS
  </div>

  <div style="
    margin-top:8px;
    color:#c9a96e;
    font-size:9px;
    letter-spacing:3px;
    text-transform:uppercase;
  ">
    Experiences Worth Showing Up For
  </div>

</td>
</tr>

<!-- HERO -->
<tr>
<td style="padding:50px 40px 30px;">

  <div style="
    color:#c9a96e;
    font-size:10px;
    letter-spacing:3px;
    text-transform:uppercase;
    margin-bottom:18px;
  ">
    WELCOME TO THE VAULT
  </div>

  <h1 style="
    margin:0;
    font-family:Georgia,serif;
    font-size:42px;
    line-height:1.15;
    font-weight:normal;
    color:#f4f0e8;
  ">
    You're on the list,<br/>
    <span style="font-style:italic;color:#c9a96e;">
      ${name}.
    </span>
  </h1>

  <p style="
    margin-top:24px;
    color:#a9a39a;
    font-size:15px;
    line-height:1.8;
  ">
    Your early access request has been received by the
    Encoreats membership concierge.
  </p>

  <p style="
    color:#a9a39a;
    font-size:15px;
    line-height:1.8;
  ">
    We curate experiences in limited seasonal drops —
    from intimate dining tables and analogue listening rooms
    to unusual architectural gatherings.
  </p>

</td>
</tr>

<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;">
  <div style="height:1px;background:#2b2b2d;"></div>
</td>
</tr>

<!-- DETAILS -->
<tr>
<td style="padding:30px 40px;">

  <div style="
    color:#c9a96e;
    font-size:10px;
    letter-spacing:2px;
    text-transform:uppercase;
    margin-bottom:18px;
  ">
    Your Preferences
  </div>

  <table width="100%" cellpadding="0" cellspacing="0">

    <tr>
      <td style="padding:10px 0;color:#777;font-size:12px;">
        CITY
      </td>

      <td style="
        padding:10px 0;
        color:#f4f0e8;
        font-size:13px;
        text-align:right;
        text-transform:uppercase;
      ">
        ${city}
      </td>
    </tr>

    <tr>
      <td style="
        padding:10px 0;
        color:#777;
        font-size:12px;
        vertical-align:top;
      ">
        PASSIONS
      </td>

      <td style="
        padding:10px 0;
        text-align:right;
      ">
        ${interestList}
      </td>
    </tr>

  </table>

  ${referralBlock}

</td>
</tr>

<!-- WHAT NEXT -->
<tr>
<td style="
  padding:34px 40px;
  background:#0d0d0f;
">

  <div style="
    color:#c9a96e;
    font-size:10px;
    letter-spacing:2px;
    text-transform:uppercase;
    margin-bottom:18px;
  ">
    What Happens Next
  </div>

  <p style="
    color:#f4f0e8;
    font-size:14px;
    line-height:1.8;
  ">
    <strong>01.</strong>&nbsp;&nbsp;
    Your preferences enter our curation queue.
  </p>

  <p style="
    color:#f4f0e8;
    font-size:14px;
    line-height:1.8;
  ">
    <strong>02.</strong>&nbsp;&nbsp;
    We match upcoming drops to your city and interests.
  </p>

  <p style="
    color:#f4f0e8;
    font-size:14px;
    line-height:1.8;
  ">
    <strong>03.</strong>&nbsp;&nbsp;
    You receive invitations before broader availability.
  </p>

</td>
</tr>

<!-- CTA -->
<tr>
<td style="padding:40px;text-align:center;">

  <a
    href="${siteUrl}/experiences"
    style="
      display:inline-block;
      padding:16px 28px;
      background:#f4f0e8;
      color:#080809;
      text-decoration:none;
      font-size:11px;
      font-weight:bold;
      letter-spacing:2px;
      text-transform:uppercase;
    "
  >
    Explore Experiences
  </a>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
  padding:28px 40px;
  border-top:1px solid #2b2b2d;
  text-align:center;
">

  <div style="
    color:#777;
    font-size:11px;
    line-height:1.7;
  ">
    Private cultural experiences.<br/>
    Carefully curated. Intentionally limited.
  </div>

  <div style="
    margin-top:15px;
    color:#c9a96e;
    font-size:10px;
    letter-spacing:2px;
  ">
    ENCOREATS
  </div>

</td>
</tr>

</table>

<div style="
  max-width:640px;
  margin-top:20px;
  color:#555;
  font-size:10px;
  text-align:center;
  line-height:1.6;
">
  You received this email because you requested early access
  to Encoreats.
</div>

</td>
</tr>
</table>

</body>
</html>
`;
}


export function adminEarlyAccessEmail({
  name,
  email,
  phone,
  city,
  interests,
  referralCode,
}: EarlyAccessEmailData) {
  return `
<!DOCTYPE html>
<html>
<body style="
  margin:0;
  padding:30px;
  background:#080809;
  color:#f4f0e8;
  font-family:Arial,Helvetica,sans-serif;
">

<div style="
  max-width:620px;
  margin:auto;
  padding:35px;
  background:#111113;
  border:1px solid #2b2b2d;
">

<div style="
  color:#c9a96e;
  font-size:10px;
  letter-spacing:3px;
  text-transform:uppercase;
">
  New Early Access Application
</div>

<h1 style="
  font-family:Georgia,serif;
  font-weight:normal;
  font-size:34px;
">
  New member request.
</h1>

<table width="100%" cellpadding="0" cellspacing="0">

<tr>
<td style="padding:12px 0;color:#777;">NAME</td>
<td style="padding:12px 0;">${name}</td>
</tr>

<tr>
<td style="padding:12px 0;color:#777;">EMAIL</td>
<td style="padding:12px 0;">${email}</td>
</tr>

<tr>
<td style="padding:12px 0;color:#777;">PHONE</td>
<td style="padding:12px 0;">${phone}</td>
</tr>

<tr>
<td style="padding:12px 0;color:#777;">CITY</td>
<td style="padding:12px 0;">${city}</td>
</tr>

<tr>
<td style="padding:12px 0;color:#777;">INTERESTS</td>
<td style="padding:12px 0;">
  ${interests.join(", ")}
</td>
</tr>

<tr>
<td style="padding:12px 0;color:#777;">REFERRAL</td>
<td style="padding:12px 0;">
  ${referralCode || "Direct"}
</td>
</tr>

</table>

</div>

</body>
</html>
`;
}