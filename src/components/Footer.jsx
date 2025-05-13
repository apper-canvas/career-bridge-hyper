const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6 mt-8">
      <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
        © {new Date().getFullYear()} CareerBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;