// Copyright 2019-2023, University of Colorado Boulder

/**
 * Root class (to be subclassed) for the top-level model of every screen.
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from './ComponentVectorStyles.js';

export default class VectorAdditionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    // @public the representation (style) used to display component vectors
    this.componentStyleProperty = new EnumerationProperty( ComponentVectorStyles.INVISIBLE );
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