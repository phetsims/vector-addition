// Copyright 2019-2020, University of Colorado Boulder

/**
 * Root class (to be subclassed) for the top-level model of every screen.
 *
 * @author Martin Veillette
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from './ComponentVectorStyles.js';

class VectorAdditionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    // @public the representation (style) used to display component vectors
    this.componentStyleProperty = new EnumerationDeprecatedProperty( ComponentVectorStyles, ComponentVectorStyles.INVISIBLE );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.componentStyleProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'VectorAdditionModel is not intended to be disposed' );
  }
}

vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );
export default VectorAdditionModel;