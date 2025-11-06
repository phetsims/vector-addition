// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsViewProperties is the set of view-specific Properties for the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';

export default class EquationsViewProperties extends VectorAdditionViewProperties {

  // whether the EquationAccordionBox is expanded
  public readonly equationAccordionBoxExpandedProperty: Property<boolean>;

  // Whether the resultant vector is visible. The resultant vector is not always a sum in the Equations screen, so
  // calling this sumVisibleProperty is a bit incorrect. But the design team wanted to keep the name sumVisibleProperty
  // to match other screens.
  public readonly sumVisibleProperty: Property<boolean>;

  // whether the BaseVectorsAccordionBox is expanded
  public readonly baseVectorsAccordionBoxExpandedProperty: Property<boolean>;

  // whether base vectors are visible on the graph
  public readonly baseVectorsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    super( {
      tandem: tandem
    } );

    this.equationAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'equationAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.sumVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'sumVisibleProperty' ),
      phetioFeatured: true
    } );

    this.baseVectorsAccordionBoxExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'baseVectorsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.baseVectorsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'baseVectorsVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    this.equationAccordionBoxExpandedProperty.reset();
    this.sumVisibleProperty.reset();
    this.baseVectorsAccordionBoxExpandedProperty.reset();
    this.baseVectorsVisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'EquationsViewProperties', EquationsViewProperties );