// Copyright 2019, University of Colorado Boulder

/**
 * View-specific Properties for the Equation screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class EquationViewProperties extends VectorAdditionViewProperties {

    constructor() {
      super();

      // @public whether the EquationToggleBox is expanded
      this.equationsExpandedProperty = new BooleanProperty( true );

      // @public whether the BaseVectorsAccordionBox is expanded
      this.baseVectorsExpandedProperty = new BooleanProperty( true );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.equationsExpandedProperty.reset();
      this.baseVectorsExpandedProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationViewProperties', EquationViewProperties );
} );