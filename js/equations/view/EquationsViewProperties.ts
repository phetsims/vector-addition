// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsViewProperties is the set of Properties that are specific to the view for the 'Equations' screen.
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

  // Whether the resultant vector is visible.
  public readonly resultantVectorVisibleProperty: Property<boolean>;

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

    this.resultantVectorVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'resultantVectorVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the resultant vector (c or f) is visible.'
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
    this.resultantVectorVisibleProperty.reset();
    this.baseVectorsAccordionBoxExpandedProperty.reset();
    this.baseVectorsVisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'EquationsViewProperties', EquationsViewProperties );