import Link from '../Link';
import { getPath } from '../services/getPath';

function ProfileLink({ className, title }) {
  
  getPath()

  return (
    <Link to={getPath()} className={className} title={title}>
      <i className="far fa-user-circle"></i>
    </Link>
  );
}

export default ProfileLink