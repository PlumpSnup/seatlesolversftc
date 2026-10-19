# Deadly · FTC Team #34237

The website for Deadly, a *FIRST* Tech Challenge team from Dubai, UAE. It is a plain HTML/CSS/JS site with no build step, laid out for phones first.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: hero with the 3D robot, who we are, stats, sponsors |
| `about.html` | Story, mission and team members |
| `impact.html` | Outreach and events |
| `robots.html` | Current robot, subsystems, competition results |
| `resources.html` | Code, CAD, portfolio and guides |
| `services.html` | Workshops, mentoring and classes |
| `sponsors.html` | Sponsor logos and sponsorship tiers |
| `contact.html` | Contact details and form |

## Editing

- **Header, footer, socials and email** are defined once in `assets/js/site.js` (`TEAM`, `NAV` and `SOCIALS`).
- **Colors and fonts** are CSS variables at the top of `assets/css/style.css`.
- **Logo:** replace `assets/img/logo.svg` with the real logo.
- **Placeholders** have a dashed orange outline (the `todo` class). Fill in the real content, then remove `todo` from that element.
- **Team members:** in `about.html`, put photos in `assets/img/team/` and replace the `?` in each card with `<img src="assets/img/team/name.jpg" alt="Name">`.
- **Background photos:** see the comments above the hero and "Who we are" sections in `index.html`.

## Preview locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing (GitHub Pages)

`.github/workflows/pages.yml` deploys the site on every push to `ss-firstcode`. To turn it on once, go to the repo's **Settings → Pages** and set **Source** to **GitHub Actions**.
