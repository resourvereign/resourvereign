import { Button, ButtonProps } from 'primereact/button';
import { Link } from 'react-router-dom';

type LinkButtonProps = ButtonProps & {
  to: string;
};
const LinkButton = ({ to, ...rest }: LinkButtonProps) => {
  return (
    <Link to={to}>
      <Button {...rest} />
    </Link>
  );
};

export default LinkButton;
