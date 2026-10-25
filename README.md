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
| `deadlier.html` | Deadlier, our sister team (orange theme) |
| `deadlier-about.html`, `deadlier-robots.html`, `deadlier-resources.html`, `deadlier-services.html` | Deadlier's own About, Robots, Resources and Services pages |

## Editing

- **Header, footer, socials and email** are defined once in `assets/js/site.js` (`TEAM`, `NAV` and `SOCIALS`).
- **Team switcher:** the Deadly / Deadlier tabs above the header come from `TEAMS` in `assets/js/site.js`. Deadlier's number is `DEADLIER.number` (still `XXXXX`); also update it in `deadlier.html`.
- **Deadlier pages:** on Deadlier pages the menu swaps Home, About, Robots, Resources and Services for Deadlier's versions (`DEADLIER_PAGES` in `site.js`). Impact, Sponsors and Contact are shared.
- **Deadlier look:** pages with `<html data-team="deadlier">` use Deadlier's colors. Set `look` in `DEADLIER` (`assets/js/site.js`) to `"daycare"` for crayon colors and the duckling logo, or `"orange"` for the orange dragon logo and accent. Nothing else needs changing to switch back.
- **Colors and fonts** are CSS variables at the top of `assets/css/style.css`.
- **Logo:** `assets/img/logo.png` is the icon (header and browser tab), `assets/img/logo-full.png` is the full logo with the wordmark (footer). Deadlier pages use the orange `logo-deadlier.png` and `logo-full-deadlier.png` instead.
- **Placeholders** have a dashed cyan outline (the `todo` class). Fill in the real content, then remove `todo` from that element.
- **Team members:** in `about.html`, put photos in `assets/img/team/` and replace the `?` in each card with `<img src="assets/img/team/name.jpg" alt="Name">`.
- **Background photos:** see the comments above the hero and "Who we are" sections in `index.html`.

## Preview locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing (GitHub Pages)

`.github/workflows/pages.yml` deploys the site on every push to `ss-firstcode`. To turn it on once, go to the repo's **Settings → Pages** and set **Source** to **GitHub Actions**.
