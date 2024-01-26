import { useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

const Camera = (props) => {
  const ref = useRef();
  return <PerspectiveCamera ref={ref} makeDefault {...props} />;
};

export default Camera;
