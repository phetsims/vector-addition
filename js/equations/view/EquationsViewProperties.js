// Copyright 2019, University of Colorado Boulder

/**
 * View-specific Properties for the 'Equations' screen. Expands on the base view Properties, and adds Properties
 * that are unique to this screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class EquationsViewProperties extends VectorAdditionViewProperties {

    constructor() {
      super();

      // @public whether the EquationToggleBox is expanded
      this.equationsExpandedProperty = new BooleanProperty( true );

      // @public whether the BaseVectorsAccordionBox is expanded
      this.baseVectorsExpandedProperty = new BooleanProperty( false );

      // @public whether base vectors are visible on the graph
      this.baseVectorsVisibleProperty = new BooleanProperty( false );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.equationsExpandedProperty.reset();
      this.baseVectorsExpandedProperty.reset();
      this.baseVectorsVisibleProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationsViewProperties', EquationsViewProperties );
} );