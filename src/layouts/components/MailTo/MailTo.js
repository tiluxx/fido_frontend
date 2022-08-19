function MailTo({ children, className }) {
    return (
        <a className={className} href={'mailto:work.lethanhtien@gmail.com'}>
            {children}
        </a>
    )
}

export default MailTo
