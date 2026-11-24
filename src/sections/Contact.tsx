import SectionHead from '../components/SectionHead';
import EnquiryForm from '../components/EnquiryForm';
import { company, inquiryOptions } from '../data/site';
import { inquire } from '../lib/inquiry';
import { Mail, MessageCircle } from '../components/Icon';

export default function Contact() {
  return (
    <section id="contact" className="sec" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead index="07" label="Contact" id="contact-title" title={<>Tell us what <em>you want to build.</em></>} />
        <div className="contact">
          <div className="contact-side">
            <p className="lead">Have a project, a partnership or an idea? Send an enquiry and we will reply by email.</p>
            <a className="btn btn-primary wa" href={company.whatsappBook} target="_blank" rel="noopener noreferrer"><span>Book a consultation on WhatsApp</span></a>
            <p className="mono inq-h">Make an inquiry about</p>
            <ul className="inq" aria-label="Choose a topic">
              {inquiryOptions.map((o) => (
                <li key={o.service}><a href="#contact" onClick={() => inquire(o.service)}>{o.label}</a></li>
              ))}
            </ul>
            <ul className="direct">
              <li><Mail size={18} aria-hidden="true" /><div><span className="mono">Email</span><a href={`mailto:${company.email}`}>{company.email}</a></div></li>
              <li><MessageCircle size={18} aria-hidden="true" /><div><span className="mono">WhatsApp</span><a href={company.whatsapp} target="_blank" rel="noopener noreferrer">{company.phone}</a></div></li>
              {company.socials.map((s) => (
                <li key={s.href}><span className="dot" /><div><span className="mono">{s.label}</span><a href={s.href} target="_blank" rel="noopener noreferrer">{s.href.replace(/^https?:\/\//, '')}</a></div></li>
              ))}
            </ul>
          </div>
          <div><EnquiryForm /></div>
        </div>
      </div>
    </section>
  );
}
